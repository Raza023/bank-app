package com.redmath.project.bank;

import com.redmath.project.bank.Account.AccountRepository;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.verify;

@SpringBootTest
@AutoConfigureMockMvc
class BankApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private AccountRepository accountRepository;

//	String expectedContentPattern = "<!DOCTYPE html>";

//	@Test
//	@WithMockUser(username = "reporter") //, roles = {"ROLE_USER"}) // Set up a mock user
//	public void testSession1ApplicationTests() throws Exception {
//		mockMvc.perform(MockMvcRequestBuilders.get("/index.html"))
//				.andDo(MockMvcResultHandlers.print())
//				.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
//				.andExpect(MockMvcResultMatchers.content().string(
//						Matchers.startsWith(expectedContentPattern)));
//	}


	@Test   //already allowed
	@WithMockUser(username = "ADMIN") //, roles = {"ROLE_USER"}) // Set up a mock user
	public void testAllNews() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/bankAccount/all"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful())
				.andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("admin"))
				.andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("hassan"));
	}

	@Test
	@WithMockUser(username = "ADMIN") //, roles = {"ROLE_USER"}) // Set up a mock user
	public void testOneNews() throws Exception{
		mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/bankAccount/1"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful())
				.andExpect(MockMvcResultMatchers.jsonPath("$.name").value("admin"));
	}

	@Test
	@WithMockUser(username = "ADMIN") //, roles = {"ROLE_USER"}) // Set up a mock user
	public void testOneNewsWithTitle() throws Exception{
		mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/bankAccount?title=admin"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful())
				.andExpect(MockMvcResultMatchers.jsonPath("$.content[0].name").value("admin"));
	}
	@Test
//	@WithMockUser(username = "reporter" , roles = "REPORTER") // Set up a mock user
	public void testInsertNews() throws Exception {
		// Create a sample news object for the request body
		String jsonRequest = "{ \"name\": \"bhai\", \"password\": \"{noop}bhai\", \"roles\": \"ADMIN\", \"email\": \"bhai@gmail.com\", \"address\": \"House number E 385 Walton Road Lahore Cantt\" }";

		mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/bankAccount")
						.with(SecurityMockMvcRequestPostProcessors.user("admin").authorities(new SimpleGrantedAuthority("ADMIN")))   //we can use this line as well.
						.with(SecurityMockMvcRequestPostProcessors.csrf())
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonRequest))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful())
				.andExpect(MockMvcResultMatchers.jsonPath("$.content.name").value("bhai"))
				.andExpect(MockMvcResultMatchers.jsonPath("$.content.roles").value("ADMIN"));
	}

//	@Test
////	@WithMockUser(username = "reporter") //, roles = {"ROLE_USER"}) // Set up a mock user
//	public void testUpdateNews() throws Exception {
//		// Create a sample news object for the request body with updated values
//		String jsonRequest = "{ \"name\": \"bhai\", \"password\": \"{noop}bhai\", \"roles\": \"ADMIN\", \"email\": \"bhai@gmail.com\", \"address\": \"House number E 385 Walton Road Lahore Cantt\" }";
//
//		mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/bankAccount/{id}", 1L)  // Provide the ID of the news item to update
//						.with(SecurityMockMvcRequestPostProcessors.user("admin").authorities(new SimpleGrantedAuthority("ADMIN")))   //we can use this line as well.
//						.with(SecurityMockMvcRequestPostProcessors.csrf())
//						.contentType(MediaType.APPLICATION_JSON)
//						.content(jsonRequest))
//				.andDo(MockMvcResultHandlers.print())
//				.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
//				.andExpect(MockMvcResultMatchers.jsonPath("$.content.name").value("bhai"))
//				.andExpect(MockMvcResultMatchers.jsonPath("$.content.roles").value("ADMIN"));
//	}
//
	@Test
//	@WithMockUser(username = "reporter", roles = {"REPORTER"}) // Set up a mock user
	public void testDeleteNews() throws Exception {
		// Perform a DELETE request to the /api/v1/news/{id} endpoint, where {id} is the ID of the news item to delete

		// When: Perform a DELETE request to the /api/v1/news/{id} endpoint
		mockMvc.perform(delete("/api/v1/bankAccount/{id}", 1L)
						.with(SecurityMockMvcRequestPostProcessors.user("admin").authorities(new SimpleGrantedAuthority("ADMIN")))
						.with(SecurityMockMvcRequestPostProcessors.csrf()))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful());

//		mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1/bankAccount/{id}", 1L))  // Provide the ID of the BANK Account item to delete
//				.with(SecurityMockMvcRequestPostProcessors.user("admin").authorities(new SimpleGrantedAuthority("ADMIN")))   //we can use this line as well.
//				.with(SecurityMockMvcRequestPostProcessors.csrf())
//				.andDo(MockMvcResultHandlers.print())
//				.andExpect(MockMvcResultMatchers.status().is2xxSuccessful());

		// Check (assure) that the news item is deleted from the database
		assertFalse(accountRepository.existsById(1L));
	}
}
